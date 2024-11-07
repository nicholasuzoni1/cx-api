import Stripe from 'stripe';
import { UserEntity } from 'apps/cx-api/entities/user.entity';
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

  async createCustomer(user: UserEntity) {
    if (user && user?.name && user?.email) {
      return await this.stripe.customers.create({
        name: user.name,
        email: user.email,
      });
    }

    return null;
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

  async listCards(
    customerId: string,
  ): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
    return await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
  }

  async removeCard(paymentMethodId: string) {
    return await this.stripe.paymentMethods.detach(paymentMethodId);
  }

  async addCard(input: { paymentMethodId: string; customerId: string }) {
    return await this.stripe.paymentMethods.attach(input.paymentMethodId, {
      customer: input.customerId,
    });
  }
}
