'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StockNotificationForm() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Lógica de submissão do formulário
        console.log("Email submitted");
    };

    return (
        <section id="notificacao-estoque" className="py-6">
             <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-center font-headline text-2xl">Produto indisponível?</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">
                        Deixe-nos o seu e-mail e iremos notificá-lo quando este produto estará disponível online.
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                        <Input type="email" placeholder="Seu email" required className="flex-1" />
                        <Button type="submit">Inscreva-se</Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
};