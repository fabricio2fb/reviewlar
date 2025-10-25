import { ReviewForm } from "@/components/admin/review-form";

export default function NewReviewPage() {
  return (
    <div>
        <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight font-headline">Novo Review</h1>
            <p className="text-muted-foreground">Preencha os campos abaixo para criar um novo review.</p>
        </div>
        <ReviewForm />
    </div>
  );
}
