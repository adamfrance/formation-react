import { http, HttpResponse } from "msw/http";
import { sampleCollaborators } from "../data/collaborators.ts";
import type { Task } from "../types.ts";

const tasks: Task[] = [
  {
    id: 1,
    todo: "Préparer la réunion de rentrée",
    completed: false,
    userId: 1,
  },
  { id: 2, todo: "Mettre à jour l'annuaire", completed: true, userId: 1 },
];

export const handlers = [
  http.get("http://localhost:4000/users", () =>
    HttpResponse.json({ users: sampleCollaborators }),
  ),
  http.get("http://localhost:4000/users/:id/todos", () =>
    HttpResponse.json({ todos: tasks }),
  ),
];
