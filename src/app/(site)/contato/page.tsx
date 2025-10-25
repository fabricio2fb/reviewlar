'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import imageData from '@/lib/placeholder-images.json';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  message: z.string().min(10, {
    message: "A mensagem deve ter pelo menos 10 caracteres.",
  }),
});

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Mensagem Enviada!",
      description: "Obrigado por entrar em contato. Responderemos em breve.",
    });
    form.reset();
  }

  const contactImage = imageData.placeholderImages.find(img => img.id === 'contact-us');

  return (
    <>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-headline font-bold">Fale Conosco</h1>
              <p className="mt-4 text-xl text-muted-foreground">
                Tem alguma dúvida, sugestão ou parceria? Adoraríamos ouvir você.
              </p>
            </header>
            
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <CardContent className="p-8">
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="font-headline text-2xl">Envie sua mensagem</CardTitle>
                  </CardHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seu Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seu Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sua Mensagem</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Deixe sua mensagem aqui..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Enviar Mensagem</Button>
                    </form>
                  </Form>
                </CardContent>
                 <div className="relative hidden md:block">
                  {contactImage && (
                    <Image
                      src={contactImage.imageUrl}
                      alt="Pessoa escrevendo em um caderno"
                      fill
                      className="object-cover rounded-r-lg"
                      data-ai-hint={contactImage.imageHint}
                    />
                  )}
                 </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
