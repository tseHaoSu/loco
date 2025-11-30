import {
  CreateSecretCommand,
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
  SecretsManagerClient,
  ResourceExistsException,
  PutSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { z } from "zod";

export function createSecretsManagerClient(): SecretsManagerClient {
  return new SecretsManagerClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

export async function getSecretValue(
  secretName: string
): Promise<GetSecretValueCommandOutput> {
  const client = createSecretsManagerClient();
  return await client.send(new GetSecretValueCommand({ SecretId: secretName }));
}

export async function upsertSecret(
  secretName: string,
  secretValue: Record<string, unknown>
): Promise<void> {
  const client = createSecretsManagerClient();
  try {
    await client.send(
      new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(secretValue),
      })
    );
  } catch (error) {
    if (error instanceof ResourceExistsException) {
      await client.send(
        new PutSecretValueCommand({
          SecretId: secretName,
          SecretString: JSON.stringify(secretValue),
        })
      );
    } else {
      throw error;
    }
  }
}

export function parseSecretValue<T>(
  secretValue: GetSecretValueCommandOutput
): T {
  if (!secretValue.SecretString) {
    throw new Error("SecretString is empty");
  }

  try {
    return JSON.parse(secretValue.SecretString) as T;
  } catch (error) {
    throw new Error(
      `Failed to parse secret as JSON: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
