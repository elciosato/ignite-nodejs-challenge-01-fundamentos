import { randomUUID } from "node:crypto";
import { Database } from "./middlewares/database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    url: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      };
      database.insert("tasks", task);
      res.writeHead(201).end();
    },
  },
  {
    method: "GET",
    url: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { query } = req;
      const search = query.search
        ? { title: query.search, description: query.search }
        : null;

      const tasks = database.select("tasks", search);
      res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "PUT",
    url: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      if (req.body) {
        // const { title, description } = req.body;
        const task = {};

        if (req.body.title) {
          Object.assign(task, {
            title: req.body.title,
            updated_at: Date.now(),
          });
        }
        if (req.body.description) {
          Object.assign(task, {
            description: req.body.description,
            updated_at: Date.now(),
          });
        }
        try {
          database.update("tasks", id, task);
          res.writeHead(204).end();
        } catch (error) {
          res.writeHead(400).end(
            JSON.stringify({
              error: error.message,
            })
          );
        }
      } else {
        res.writeHead(400).end(
          JSON.stringify({
            error: "Title and Description not found",
          })
        );
      }
    },
  },
  {
    method: "DELETE",
    url: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      try {
        database.delete("tasks", id);
        res.writeHead(204).end();
      } catch (error) {
        res.writeHead(400).end(
          JSON.stringify({
            error: error.message,
          })
        );
      }
    },
  },
  {
    method: "PATCH",
    url: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      try {
        database.taskComplete("tasks", id);
        res.writeHead(204).end();
      } catch (error) {
        res.writeHead(400).end(
          JSON.stringify({
            error: error.message,
          })
        );
      }
    },
  },
];
