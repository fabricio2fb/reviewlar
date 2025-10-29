'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Por favor, insira um email válido."),
  subject: z.string().min(5, "O assunto deve ter pelo menos 5 caracteres."),
  message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres."),
});

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Em um app real, aqui você enviaria os dados para um backend ou serviço.
    // Para este exemplo, apenas exibimos um toast e resetamos o formulário.
    console.log(values);
    toast({
      title: "Mensagem Enviada com Sucesso!",
      description: "Obrigado por entrar em contato. Responderemos em breve.",
    });
    form.reset();
  }

  return (
    <>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-headline font-bold">Entre em Contato</h1>
              <p className="mt-4 text-xl text-muted-foreground">
                Tem dúvidas, sugestões ou quer reportar algum problema? Estamos aqui para ajudar!
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <div className="space-y-6">
                    <h2 className="text-2xl font-headline font-bold">Fale Conosco</h2>
                    <p className="text-muted-foreground">
                        Preencha o formulário ao lado ou, se preferir, nos envie um e-mail diretamente. 
                        Geralmente respondemos em até 48 horas úteis.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <Mail className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Email</h3>
                                <a href="mailto:contato@reviewlar.site" className="text-primary hover:underline">contato@reviewlar.site</a>
                                <p className="text-sm text-muted-foreground">Para todas as questões.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <MessageSquare className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Estamos abertos para:</h3>
                                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                    <li>Dúvidas sobre produtos</li>
                                    <li>Sugestões de novos reviews</li>
                                    <li>Parcerias comerciais</li>
                                    <li>Questões sobre privacidade</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Envie sua mensagem</CardTitle>
                        <CardDescription>Responderemos o mais rápido possível.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl><Input placeholder="Seu nome completo" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" placeholder="seu.email@exemplo.com" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assunto</FormLabel>
                                <FormControl><Input placeholder="Sobre qual assunto você quer falar?" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mensagem</FormLabel>
                                <FormControl><Textarea placeholder="Escreva sua mensagem aqui..." className="resize-none" rows={5} {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full">
                            <Send className="mr-2 h-4 w-4" />
                            Enviar Mensagem
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
