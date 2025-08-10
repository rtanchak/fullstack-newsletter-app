import { SubscribeInput } from "./subscribers.schemas";
import { 
  upsertActiveSubscriber,
  findActiveSubscribers,
  findSubscribersByIds
} from "./subscribers.repository";

export async function subscribe(input: SubscribeInput) {
  return await upsertActiveSubscriber(input.email);
}

export async function getActiveSubscribers() {
  return await findActiveSubscribers();
}

export async function getSubscribersByIds(subscriberIds: string[]) {
  return await findSubscribersByIds(subscriberIds);
}
