'use client';
import { Title } from "@/shared/components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // Loading
    
        if (session?.user.role !== 'ADMIN') {
          router.push('/not-auth');
        }
      }, [session, status, router]);
    
      if (status === 'loading') {
        return <div className="p-10">Loading...</div>;
      }

    return (
        <div className="p-8 ">
           <Title text="Добро пожаловать в админ-панель PIZZA-NEXT"
                className="text-4xl font-bold mb-4 leading-[4rem] text-center"
            /> 
        </div>
    );
}