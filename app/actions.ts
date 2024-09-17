'use server';

import { prisma } from "@/prisma/prisma-client";
import { CheckoutFormValues } from "@/shared/constants";
import { OrderStatus, Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { createPayment, sendEmail } from '@/shared/lib';
import { PayOrderTemplate } from '@/shared/components/shared/email-templates';
import { getUserSession } from "@/shared/lib/get-user-session";
import { hashSync } from "bcrypt";
import { VerificationUserTemplate } from "@/shared/components/shared/email-templates/verification-user";
import { revalidatePath } from "next/cache";


export async function registerUser(body: Prisma.UserCreateInput) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });
  
      if (user) {
        if (!user.verified) {
          throw new Error('Почта не подтверждена');
        }
  
        throw new Error('Пользователь уже существует');
      }
  
      const createdUser = await prisma.user.create({
        data: {
            fullName: body.fullName,
            email: body.email,
            password: hashSync(body.password, 10),
        },
      });
  
      const code = Math.floor(100000 + Math.random() * 900000).toString();
  
      await prisma.verificationCode.create({
        data: {
          code,
          userId: createdUser.id,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
  
      console.log(createdUser);

      const html = `
      <p>Код подтверждения: <h2>${code}</h2></p>
      <p><a href="http://localhost:3000/api/auth/verify?code=${code}">Подтвердить регистрацию</a></p>
      `;
  
      await sendEmail(createdUser.email, 'Next Pizza | Подтверждение регистрации', html);
  
    //   await sendEmail(
    //     createdUser.email, 
    //     'Next Pizza | 📝 Подтверждение регистрации',
    //     VerificationUserTemplate({ 
    //         code, 
    //     })
    // );
    } catch (error) {
      console.log('Error [CREATE_USER]', error);
      throw error;
    }
}


export async function createOrder(data: CheckoutFormValues) {
  console.log('createOrder called with:', data);
  try {
      const cookieStore = cookies();
      const cartToken = cookieStore.get('cartToken')?.value;

      if (!cartToken) {
          throw new Error('No token found in cookies');
      }

      // Найти корзину по токену
      const useCart = await prisma.cart.findFirst({
          include: {
              user: true,
              items: {
                  include: {
                      ingredients: true,
                      productItem: {
                          include: {
                              product: true,
                          },
                      },
                  },
              },
          },
          where: {
              token: cartToken,
          },
      });

      if (!useCart) {
          throw new Error('Cart not found');
      }

      if (useCart.totalAmount === 0) {
          throw new Error('Cart is empty');
      }
//////////////////////////////////////////////////////////
      const convertToString = (value: string ): number => {
        const normalizedValue = value.replace(',', '.');
        return parseFloat(normalizedValue);
      };
      // Пример использования функции перед отправкой данных
      const vatAmount = convertToString(data.vatPrice);
      const deliveryAmount = convertToString(data.deliveryPrice);
      const totalPriceAmount = convertToString(data.totalPrice);
      // Создать заказ
      const order = await prisma.order.create({
          data: {
              fullName: `${data.firstName} ${data.lastName}`,
              email: data.email,
              phone: data.phone,
              address: data.address,
              comment: data.comment || '',
              status: OrderStatus.PENDING,
              items: JSON.stringify(useCart.items),
              vatAmount: vatAmount,
              deliveryAmount: deliveryAmount,
              totalPriceAmount: totalPriceAmount,
          },
      });
      console.log('Order created:', order);
      // Очистить корзину
      await prisma.cart.update({
          where: {
              id: useCart.id,
          },
          data: {
              totalAmount: 0,
          },
      });

      await prisma.cartItem.deleteMany({
          where: {
              cartId: useCart.id,
          },
      });

      // Создание платежа
      const paymentData = await createPayment({
          amount: order.totalPriceAmount,
          orderId: order.id,
          description: `Оплата заказа #${order.id}`,
      });
      console.log('Payment data:', paymentData);
      if (!paymentData) {
          throw new Error('Payment data not found');
      }

      await prisma.order.update({
          where: {
              id: order.id,
          },
          data: {
              paymentId: paymentData.id,
          },
      });

      const paymentUrl = paymentData.confirmation.confirmation_url;

      const html = `
      <h1>Заказ #${order?.id}</h1>

      <p>Оплатите заказ на сумму ${order?.totalPriceAmount} ₽. Перейдите <a href="${paymentData.confirmation.confirmation_url}">по ссылке</a> для оплаты заказа.</p>
    `;
  //  if (useCart.user?.email) {
      await sendEmail(
        data.email, 
        `Next Pizza | Оплатите заказ #${order?.id}`, 
        html,
        
      );
  //  }

      // Отправка письма
      // await sendEmail(
      //     data.email,
      //     `Pizza Next | Оплатите заказ #${order.id}`,
      //     html,

      //     // PayOrderTemplate({
      //     //     orderId: order.id,
      //     //     totalAmount: order.totalAmount,
      //     //     paymentUrl,
      //     // })
      // );

      return paymentUrl;
  } catch (error) {
      console.error('[actions.ts:createOrder] Server error', error);
      throw error; // Обязательно бросайте ошибку, чтобы она могла быть обработана выше
  }
}

  
//   export async function createOrder(data: CheckoutFormValues) {
//     try {
//         const cookieStore = cookies();
//         const cartToken = cookieStore.get('cartToken')?.value;

//         if (!cartToken) {
//             throw new Error('No token');
//         }
//         //* находим корзину по токену
//         const useCart = await prisma.cart.findFirst({
//             include: {
//                 user: true,
//                 items : {
//                     include: {
//                         ingredients: true,
//                         productItem: {
//                             include: {
//                                 product: true,
//                             },
//                         }, 
//                     },
//                 },
//             },
//             where: {
//                 token: cartToken,
//             },
//         });

//         //* если корзина не найдена возвращаем ошибку
//         if (!useCart) {
//             throw new Error('Cart not found');
//         }

//         //* если корзина пустая возвращаем ошибку
//         if (useCart?.totalAmount === 0) {
//             throw new Error('Cart is empty');
//         }

//         //* создаем заказ
//         const order = await prisma.order.create({
//             data: {
//               //  token: cartToken,
//                 fullName: data.firstName + ' ' + data.lastName,
//                 email: data.email,
//                 phone: data.phone,
//                 address: data.address,
//                 comment: data.comment,
//                 totalAmount: useCart.totalAmount,
//                 status: OrderStatus.PENDING,
//                 items: JSON.stringify(useCart.items),
//                 vatAmount: 0,
//                 deliveryAmount: 0,
//             },
//         });

//         //* очищаем стоимость корзины
//         await prisma.cart.update({
//             where: {
//                 id: useCart.id,
//             },
//             data: {
//                 totalAmount: 0,
//             },
//         });
        
//         //* очищаем корзину от товаров
//         await prisma.cartItem.deleteMany({
//             where: {
//                 cartId: useCart.id,
//             },
//         });

//         // TODO: создание ссылки на страницу успешного оформления заказа

//         const paymentData = await createPayment({
//             amount: order.totalAmount,
//             orderId: order.id,
//             description: 'Оплата заказа #' + order.id,
//         });

//         if (!paymentData) {
//             throw new Error('Payment data not found');
//         }

//         await prisma.order.update({
//             where: {
//                 id: order.id,
//             },
//             data: {
//                 paymentId: paymentData.id,
//             },
//         });

//         const paymentUrl = paymentData.confirmation.confirmation_url;

//         await sendEmail(
//             data.email, 
//             "Pizza Next | Оплатите заказ #" + order.id, 
//             PayOrderTemplate({
//                 orderId: order.id,
//                 totalAmount: order.totalAmount,
//                 paymentUrl,
//             }));

//         return paymentUrl;
//     } catch (error) {
//         console.log('[actions.ts:createOrder] Server error', error);
//     }
// }

export async function updateUserInfo(body: Prisma.UserCreateInput) {
    try {
        const currentUser = await getUserSession();

        if (!currentUser) {
            throw new Error('Пользователь не найден');
        }

        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(currentUser.id),
            },
        });
        
        await prisma.user.update({
            where: {
                id: Number(currentUser.id),
            },
            data: {
                fullName: body.fullName,
                email: body.email,
                password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
            },
        });
    } catch (error) {
        console.log('[actions.ts:updateUserInfo] Server error', error);
        throw error;
    }
}




/* Dashboard Actions */

export async function updateUser(id: number, data: Prisma.UserUpdateInput) {
    try {
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          ...data,
          verified: new Date(),
          ...(data.password && { password: hashSync(String(data.password), 10) }),
        },
      });
    } catch (error) {
      console.log('Error [UPDATE_USER]', error);
      throw error;
    }
  }
  
  export async function createUser(data: Prisma.UserCreateInput) {
    try {
      await prisma.user.create({
        data: {
          ...data,
          password: hashSync(data.password, 10),
        },
      });
  
      revalidatePath('/dashboard/users');
    } catch (error) {
      console.log('Error [CREATE_USER]', error);
      throw error;
    }
  }
  
  export async function deleteUser(id: number) {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  
    revalidatePath('/dashboard/users');
  }
  
  export async function updateCategory(id: number, data: Prisma.CategoryUpdateInput) {
    try {
      await prisma.category.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      console.log('Error [UPDATE_CATEGORY]', error);
      throw error;
    }
  }
  
  export async function createCategory(data: Prisma.CategoryCreateInput) {
    try {
      await prisma.category.create({
        data,
      });
  
      revalidatePath('/dashboard/categories');
    } catch (error) {
      console.log('Error [CREATE_CATEGORY]', error);
      throw error;
    }
  }
  
  export async function deleteCategory(id: number) {
    await prisma.category.delete({
      where: {
        id,
      },
    });
  
    revalidatePath('/dashboard/categories');
  }
  
  export async function updateProduct(id: number, data: Prisma.ProductUpdateInput) {
    try {
      await prisma.product.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      console.log('Error [UPDATE_PRODUCT]', error);
      throw error;
    }
  }
  
  export async function createProduct(data: Prisma.ProductCreateInput) {
    try {
      await prisma.product.create({
        data,
      });
  
      revalidatePath('/dashboard/products');
    } catch (error) {
      console.log('Error [CREATE_PRODUCT]', error);
      throw error;
    }
  }
  
  export async function deleteProduct(id: number) {
    await prisma.product.delete({
      where: {
        id,
      },
    });
  
    revalidatePath('/dashboard/products');
  }
  
  export async function updateIngredient(id: number, data: Prisma.IngredientUpdateInput) {
    try {
      await prisma.ingredient.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      console.log('Error [UPDATE_INGREDIENT]', error);
      throw error;
    }
  }
  
  export async function createIngredient(data: Prisma.IngredientCreateInput) {
    try {
      await prisma.ingredient.create({
        data: {
          name: data.name,
          imageUrl: data.imageUrl,
          price: data.price,
        },
      });
  
      revalidatePath('/dashboard/ingredients');
    } catch (error) {
      console.log('Error [CREATE_INGREDIENT]', error);
      throw error;
    }
  }
  
  export async function deleteIngredient(id: number) {
    try {
      await prisma.ingredient.delete({
        where: {
          id,
        },
      });
  
      revalidatePath('/dashboard/ingredients');
    } catch (error) {
      console.log('Error [DELETE_INGREDIENT]', error);
      throw error;
    }
  }
  
  export async function updateProductItem(id: number, data: Prisma.ProductItemUpdateInput) {
    try {
      await prisma.productItem.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      console.log('Error [UPDATE_PRODUCT_ITEM]', error);
      throw error;
    }
  }

  // export const updateProductItem = async (id: number, data: {
  //   price: number;
  //   size?: number | null;
  //   pizzaType?: number | null;
  //   product: { connect: { id: number } };
  // }) => {
  //   return prisma.productItem.update({
  //     where: { id },
  //     data,
  //   });
  // };
  
  export async function createProductItem(data: Prisma.ProductItemUncheckedCreateInput) {
    try {
      await prisma.productItem.create({
        data: {
          price: data.price,
          size: data.size,
          pizzaType: data.pizzaType,
          productId: data.productId,
        },
      });
  
      revalidatePath('/dashboard/product-items');
    } catch (error) {
      console.log('Error [CREATE_PRODUCT_ITEM]', error);
      throw error;
    }
  }
  
  export async function deleteProductItem(id: number) {
    try {
      await prisma.productItem.delete({
        where: {
          id,
        },
      });
  
      revalidatePath('/dashboard/product-items');
    } catch (error) {
      console.log('Error [DELETE_PRODUCT_ITEM]', error);
      throw error;
    }
  }

// ? Добавление ингредиентов к продукту (Product ↔ Ingredient)

//import prisma from '@/lib/prisma';

export async function addIngredientToProduct(productId: number, ingredientIds: number[]) {
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      ingredients: {
        connect: ingredientIds.map((id) => ({ id })),
      },
    },
  });
}

// ?  Добавление ингредиентов к элементу корзины (CartItem ↔ Ingredient)
//import prisma from '@/lib/prisma';

async function addIngredientToCartItem(cartItemId: number, ingredientIds: number[]) {
  await prisma.cartItem.update({
    where: {
      id: cartItemId,
    },
    data: {
      ingredients: {
        connect: ingredientIds.map((id) => ({ id })),
      },
    },
  });
} 

//*  
  /**
   ** Пример API для создания связей
Если вы создаете API для работы с этими связями, ваше обращение будет выглядеть так:

POST /api/product/:id/ingredients — добавление ингредиентов к продукту
POST /api/cart-item/:id/ingredients — добавление ингредиентов к элементу корзины
Пример API-роута для добавления ингредиентов к продукту:


import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id } = req.query; // id продукта
    const { ingredientIds } = req.body; // список ингредиентов

    try {
      await prisma.product.update({
        where: { id: Number(id) },
        data: {
          ingredients: {
            connect: ingredientIds.map((id: number) => ({ id })),
          },
        },
      });
      res.status(200).json({ message: 'Ingredients added to product' });
    } catch (error) {
      res.status(500).json({ error: 'Error adding ingredients' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
   */
  
