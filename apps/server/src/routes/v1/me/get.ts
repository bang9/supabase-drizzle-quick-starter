import { ErrorCode, ServerError } from '$core/error';
import { UserProfile, database } from '$database';
import { _userProfileSchema } from '$tools/schema/atomic';
import { createSchema } from '$tools/schema/createSchema';
import { createObjectSchema } from '$tools/schema/createSchemaType';
import { pickSchema } from '$tools/schema/pickSchema';
import { schemify } from '$tools/schema/schemify';
import { vUserProfileSelect } from '$database/validator';
import { FastifyRequest } from 'fastify';

const schema = {
  profile: schemify('id', 'userId', 'email', 'provider', 'role', 'nickname', 'avatar', 'age', 'createdAt', 'updatedAt'),
};

const validator = {
  profile: vUserProfileSelect.pick(schema.profile.validator),
};

export const meGetHandler = async (req: FastifyRequest) => {
  const user = await database.query.AuthUsers.findFirst({
    where: (user, { eq }) => eq(user.id, req.user.sub),
  });

  if (!user) throw ServerError.create(ErrorCode.NOT_FOUND_DATA, req.localize('not_found_user'), 404);

  await database.transaction(async (tx) => {
    await tx
      .insert(UserProfile)
      .values({
        userId: user.id,
        provider: req.user.app_metadata.provider,
        role: 'user',
        email: req.user.email,
        nickname: req.user.user_metadata.full_name ?? req.user.user_metadata.name,
        avatar: req.user.user_metadata.avatar_url ?? req.user.user_metadata.picture,
      })
      .onConflictDoNothing({
        target: UserProfile.userId,
      });
  });

  const profile = await database.query.UserProfile.findFirst({
    where: (profile, { eq }) => eq(profile.userId, user.id),
  });

  return {
    profile: validator.profile.parse(profile),
  };
};

export const meGetSchema = createSchema({
  description: 'Get profile',
  tags: ['Me'],
  summary: 'get profile of current user',
  response: {
    '2xx': {
      type: 'object',
      description: 'Successful response',
      required: ['profile', 'survey', 'status', 'remainSurveyKeys'],
      properties: {
        profile: createObjectSchema({
          type: 'object',
          properties: pickSchema(_userProfileSchema, schema.profile.swagger),
          description: 'user profile',
        }),
      },
    },
  },
});
