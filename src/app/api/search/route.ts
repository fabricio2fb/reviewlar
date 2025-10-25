import { getReviews } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();
        if (!query) {
            return NextResponse.json([]);
        }
        
        const reviews = getReviews();
        
        const filteredReviews = reviews.filter(
            (review) =>
              review.title.toLowerCase().includes(query.toLowerCase()) ||
              review.summary.toLowerCase().includes(query.toLowerCase()) ||
              review.category.toLowerCase().includes(query.toLowerCase())
          );

        return NextResponse.json(filteredReviews);
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
