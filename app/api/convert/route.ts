import { NextRequest, NextResponse } from 'next/server';
import { ConvertHandler } from '../../../lib/convertHandler';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input');

  if (!input) {
    return NextResponse.json(
      { error: 'No input provided' },
      { status: 400 }
    );
  }

  const result = ConvertHandler.processInput(input);

  if (typeof result === 'string') {
    return NextResponse.json({ error: result });
  }

  return NextResponse.json(result);
}

export const dynamic = 'force-dynamic';