

export type PaymentCallbackData = {
  type: string;
  event: string;
  object: {
    id: string;
    status: string;
    amount: { value: string; currency: 'RUB' };
    income_amount: { value: string; currency: 'RUB' };
    description: string;
    recipient: { account_id: string; gateway_id: string };
    payment_method: {
      type: string;
      id: string;
      saved: boolean;
      title: string;
    };
    captured_at: string;
    created_at: string;
    test: boolean;
    refunded_amount: { value: string; currency: 'RUB' };
    paid: boolean;
    refundable: true;
    metadata: { order_id: string };
    authorization_details: {
      rrn: string;
      auth_code: string;
    };
  };
};

