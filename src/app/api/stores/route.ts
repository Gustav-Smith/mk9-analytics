import { NextRequest, NextResponse } from 'next/server';
import { storeService } from '@/modules/stores/services/StoreService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const searchParam = searchParams.get('search') || undefined;
    const chainParam = searchParams.get('chain') || undefined;
    const cityParam = searchParams.get('city') || undefined;
    const stateParam = searchParams.get('state') || undefined;

    const stores = await storeService.getStores({
      page,
      limit,
      search: searchParam,
      chain: chainParam,
      city: cityParam,
      state: stateParam,
    });

    return NextResponse.json(stores);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stores' },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const store = await storeService.createStore(data);

    return NextResponse.json(store, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create store' },
      { status: error.status || 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json();

    const store = await storeService.updateStore(id, data);

    return NextResponse.json(store);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update store' },
      { status: error.status || 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    const result = await storeService.deleteStore(id);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete store' },
      { status: error.status || 400 }
    );
  }
}

export const dynamic = 'force-dynamic';