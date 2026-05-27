import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'pets';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const name = formData.get('name') as string;
    const species = formData.get('species') as string;

    // Validate
    if (!photo || !name || !species) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['gato', 'perro', 'otro'].includes(species)) {
      return NextResponse.json(
        { error: 'Invalid species' },
        { status: 400 }
      );
    }

    if (photo.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      );
    }

    // Upload photo to Supabase Storage
    const fileId = uuidv4();
    const fileExt = photo.name.split('.').pop() || 'jpg';
    const fileName = `${fileId}.${fileExt}`;

    const buffer = await photo.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: photo.type,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload photo' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    const photoUrl = publicUrlData.publicUrl;

    // Insert pet to database
    const { data: pet, error: dbError } = await supabase
      .from('pets')
      .insert({
        name: name.trim(),
        species,
        photo_url: photoUrl,
        owner_id: null, // Anonymous upload for now
        total_votes: 0,
        wins: 0,
        losses: 0,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save pet' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      petId: pet.id,
      message: 'Pet uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
