import { isNullish } from '$core/utils';
import { UserProfile, database } from '$database';
import { _userProfileSchema } from '$tools/schema/atomic';
import { createSchema } from '$tools/schema/createSchema';
import { createObjectSchema } from '$tools/schema/createSchemaType';
import { pickSchema } from '$tools/schema/pickSchema';
import { schemify } from '$tools/schema/schemify';
import { vUserProfileInsert } from '$database/validator';
import { eq } from 'drizzle-orm';
import { FastifyReply, FastifyRequest } from 'fastify';
import { shake } from 'radash';

const schema = {
  body: {
    profile: schemify('nickname', 'avatar', 'age'),
  },
};

const validator = {
  body: {
    profile: vUserProfileInsert.pick(schema.body.profile.validator),
  },
};

type Body = { profile: Pick<typeof UserProfile.$inferInsert, (typeof schema.body.profile.swagger)[number]> };
export const mePutHandler = async (req: FastifyRequest<{ Body?: Body }>, rep: FastifyReply) => {
  const userId = req.user.sub;

  const profile = validator.body.profile.parse(shake(req.body?.profile, isNullish));

  await database.transaction(async (tx) => {
    if (Object.keys(profile).length > 1) {
      await tx.update(UserProfile).set(profile).where(eq(UserProfile.userId, userId));
    }
  });

  rep.status(204);
};

export const mePutSchema = createSchema({
  description: 'Update profile',
  tags: ['Me'],
  summary: 'update profile of current user',
  body: {
    type: 'object',
    properties: {
      profile: createObjectSchema({
        required: [],
        properties: pickSchema(_userProfileSchema, schema.body.profile.swagger),
      }),
    },
  },
  response: {
    204: {
      type: 'null',
      description: 'Successful response',
    },
  },
});
