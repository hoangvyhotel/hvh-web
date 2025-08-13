import { endpoints } from "../lib/http/endpoints";
import { toQuery } from "../lib/http/utils";

export const userRequests = {
  list: (params = {}) => ({
    method: "GET",
    url: endpoints.users.list() + toQuery(params),
  }),
  get: (id) => ({ method: "GET", url: endpoints.users.detail(id) }),
  create: (dto) => ({ method: "POST", url: endpoints.users.root(), data: dto }),
  update: (id, dto) => ({ method: "PUT", url: endpoints.users.detail(id), data: dto }),
  remove: (id) => ({ method: "DELETE", url: endpoints.users.detail(id) }),
};