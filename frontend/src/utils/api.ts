const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchUsers(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  return response.json();
}

export async function createUser(user: {
  username: string;
  email: string;
  name: string;
  role: string;
  password: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return response.json();
}

export async function getUser(userId: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  return response.json();
}

export async function getProfile(userId: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/profiles/${userId}`);
  return response.json();
}

export async function updateProfile(userId: number, profile: Record<string, number>): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  return response.json();
}

export async function getSuggestion(userId: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/profiles/${userId}/suggestion`);
  return response.json();
}

export async function getTasks(category?: string): Promise<any[]> {
  const url = category ? `${API_BASE_URL}/tasks?category=${category}` : `${API_BASE_URL}/tasks`;
  const response = await fetch(url);
  return response.json();
}

export async function createTask(task: {
  name: string;
  description: string;
  steps: string[];
  category?: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return response.json();
}

export async function createTaskRecord(record: {
  user_id: number;
  task_id: number;
  steps_completed: number;
  total_steps: number;
  intervention_count: number;
  quality_score: number;
  emotion_state: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/tasks/record`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  return response.json();
}

export async function getTaskRecords(userId: number): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/tasks/record/user/${userId}`);
  return response.json();
}

export async function runSimulation(params: {
  scenario: string;
  patient_id?: number;
  initial_abilities?: Record<string, number>;
  steps?: number;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/simulations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
}

export async function getSimulations(patientId?: number): Promise<any[]> {
  const url = patientId ? `${API_BASE_URL}/simulations?patient_id=${patientId}` : `${API_BASE_URL}/simulations`;
  const response = await fetch(url);
  return response.json();
}

export async function createBehaviorRecord(record: {
  user_id: number;
  record_type: string;
  data: Record<string, unknown>;
  recorded_by: number;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  return response.json();
}

export async function getBehaviorRecords(userId: number): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/records/user/${userId}`);
  return response.json();
}
