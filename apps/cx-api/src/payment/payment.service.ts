import Stripe from 'stripe';

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
    );
  }

  async getCustomer(email: string): Promise<Stripe.Customer> {
    const customers = await this.stripe.customers.search({
      query: `email:'${email}'`,
    });

    if (customers?.data?.length > 0) {
      return customers.data?.[0] || null;
    }

    return null;
  }

  async getSubscription(email: string): Promise<Stripe.Subscription> {
    if (!email) return null;

    const customer = await this.getCustomer(email);

    const subscriptions = customer
      ? await this.stripe.subscriptions.list({
          customer: customer.id,
          status: 'active',
        })
      : null;

    if (subscriptions?.data?.length) {
      return subscriptions?.data?.[0] || null;
    }

    return null;
  }
}
