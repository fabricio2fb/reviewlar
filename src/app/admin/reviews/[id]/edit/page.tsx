'use client';

import { ReviewForm } from "@/components/admin/review-form";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getReviewById } from "@/lib/server-actions";


export default function EditReviewPage({ params }: { params: { id: string } }) {
  const { data: review, isLoading, error } = useQuery({
    queryKey: ['review', params.id],
    queryFn: () => getReviewById(params.id),
  });


  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!review) {
    notFound();
  }

  return (
    <div>
        <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight font-headline">Editar Review</h1>
            <p className="text-muted-foreground">Modifique os campos abaixo para atualizar o review.</p>
        </div>
        <ReviewForm initialData={review} />
    </div>
  );
}
