import { SubscribeInput } from "./subscribers.schemas";
import { upsertActiveSubscriber } from "./subscribers.repository";

export async function subscribe(input: SubscribeInput) {
  const sub = await upsertActiveSubscriber(input.email);
  return sub;
}
