'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { File, PlusCircle, MoreHorizontal, Search, Loader2, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Review, Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteReview, getReviews, getCategories } from '@/lib/server-actions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [isDark, setIsDark] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard-theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.body.classList.add('dashboard-dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('dashboard-theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.body.classList.add('dashboard-dark');
    } else {
      document.body.classList.remove('dashboard-dark');
    }
  };

  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: getReviews,
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast({ title: 'Review apagado com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao apagar review',
        description: 'Tente novamente.',
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const filteredReviews = (reviews || []).filter((review) =>
    review.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const jsDate = new Date(date);
    return jsDate.toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Alternar tema</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Reviews</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingReviews ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{reviews?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              reviews publicados no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingCategories ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{categories?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              categorias ativas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>
                Gerencie os reviews do seu blog.
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div className="relative md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Pesquisar por título..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button asChild size="sm" className="gap-1">
                <Link href="/admin/reviews/new">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Novo Review</span>
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Publicado em</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingReviews && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  </TableCell>
                </TableRow>
              )}
              {!loadingReviews &&
                filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{review.category}</Badge>
                    </TableCell>
                    <TableCell>{review.rating.toFixed(1)}</TableCell>
                    <TableCell>{formatDate(review.publishedAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/reviews/${review.id}/edit`}>Editar</Link>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-sm p-2 font-normal text-destructive hover:bg-destructive/10"
                              >
                                Apagar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Essa ação não pode ser desfeita. Isso irá apagar permanentemente o review.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(review.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Apagar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>{filteredReviews.length}</strong> de <strong>{reviews?.length || 0}</strong> reviews
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}