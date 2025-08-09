import { SubscribeInput } from "./subscribers.schemas";
import { upsertActiveSubscriber } from "./subscribers.repository";

export async function subscribe(input: SubscribeInput) {
  return await upsertActiveSubscriber(input.email);
}
