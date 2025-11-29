import { supabase } from './supabase';

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erro ao buscar sessão:', error);
      return null;
    }
    
    if (!session) {
      return null;
    }
    
    return session.user;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
  return data;
}

export async function createUserProfile(userId: string, fullName?: string) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        user_id: userId,
        full_name: fullName || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar perfil:', error);
    throw error;
  }
  return data;
}

export async function updateUserProfile(userId: string, updates: { full_name?: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
  return data;
}

export async function getUserData(userId: string) {
  const { data, error } = await supabase
    .from('user_data')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar dados do usuário:', error);
    return null;
  }
  return data;
}

export async function createUserData(userId: string, dailySavings: number = 0) {
  const { data, error } = await supabase
    .from('user_data')
    .insert([
      {
        user_id: userId,
        saved_money: 0,
        days_clean: 0,
        mood: 7,
        daily_savings: dailySavings,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar dados do usuário:', error);
    throw error;
  }
  return data;
}

export async function updateUserData(
  userId: string,
  updates: {
    saved_money?: number;
    days_clean?: number;
    mood?: number;
    daily_savings?: number;
    last_savings_click?: string | null;
  }
) {
  const { data, error } = await supabase
    .from('user_data')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar dados do usuário:', error);
    throw error;
  }
  return data;
}

export async function getUserGoals(userId: string) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar objetivos:', error);
    return [];
  }
  return data || [];
}

export async function createGoal(
  userId: string,
  goal: {
    name: string;
    icon: string;
    target_amount: number;
    current_amount?: number;
  }
) {
  const { data, error } = await supabase
    .from('goals')
    .insert([
      {
        user_id: userId,
        ...goal,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar objetivo:', error);
    throw error;
  }
  return data;
}

export async function updateGoal(
  goalId: string,
  updates: {
    name?: string;
    icon?: string;
    target_amount?: number;
    current_amount?: number;
  }
) {
  const { data, error } = await supabase
    .from('goals')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', goalId)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar objetivo:', error);
    throw error;
  }
  return data;
}
