import React from "react";
import { useSession } from "next-auth/react";
import { CircleUser, User } from "lucide-react";
import { Button } from "../ui";
import Link from "next/link";

interface Props {
    className?: string
    onClickSignIn?: () => void;
}

export const ProfileButton: React.FC<Props> = ({ className, onClickSignIn }) => {
    const { data: session } = useSession();

    return (
        <div className={className}>
            {!session ? (
                <Button onClick={onClickSignIn} variant="outline">
                    <User size={16} />
                    Войти
                </Button>
            ) : (
                <Link href="/profile">
                    <Button variant="secondary" className="flex items-center gap-2">
                        <CircleUser size={18} />
                        Профиль
                    </Button>
                </Link>
            )}
        </div>
    )
}