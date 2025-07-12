import { data } from 'react-router';
import type { Route } from './+types/v1.workflow.request';
import { z } from 'zod/v4';

const requestSchema = z.object({
  url: z.url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  headers: z.record(z.string(), z.string()),
  body: z.record(z.string(), z.string()),
  query: z.record(z.string(), z.string()),
});

export async function action(args: Route.ActionArgs) {
  const { request } = args;
  try {
    const json = await request.json();
    const result = await requestSchema.safeParseAsync(json);

    if (!result.success) {
      return data({ error: result.error.message }, { status: 400 });
    }

    const {
      url: _url,
      method,
      headers: _headers,
      body: _body,
      query,
    } = result.data;

    const url = new URL(_url);
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const headers = new Headers();
    Object.entries(_headers).forEach(([key, value]) => {
      headers.set(key, value);
    });

    const response = await fetch(String(url), {
      method,
      headers,
      ...(method === 'GET' ? {} : { body: JSON.stringify(_body) }),
    });

    const body = await response.json();
    const http = {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };

    return data({
      http,
      body,
    });
  } catch (error) {
    return data(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
