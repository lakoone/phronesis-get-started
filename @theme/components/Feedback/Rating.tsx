import * as React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

import type { OptionalEmailSettings } from '@redocly/config';
import type { ReasonsProps } from '@redocly/theme/components/Feedback/Reasons';

import { Reasons } from '@redocly/theme/components/Feedback/Reasons';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { RadioCheckButtonIcon } from '@redocly/theme/icons/RadioCheckButtonIcon/RadioCheckButtonIcon';
import { Comment } from '@redocly/theme/components/Feedback/Comment';
import { Stars } from '@redocly/theme/components/Feedback/Stars';
import { Button } from '@redocly/theme/components/Button/Button';

export const FEEDBACK_MAX_RATING = 3;

export type RatingProps = {
  onSubmit: (value: {
    score: number;
    comment?: string;
    reasons?: string[];
    max: number;
    email?: string;
  }) => void;
  settings?: {
    label?: string;
    submitText?: string;
    comment?: {
      hide?: boolean;
      label?: string;
    };
    reasons?: {
      hide?: boolean;
      label?: string;
      component?: string;
      items: string[];
    };
    optionalEmail?: OptionalEmailSettings;
  };
  className?: string;
};

export function Rating({ settings, onSubmit, className }: RatingProps): JSX.Element {
  const {
    label,
    submitText,
    comment: commentSettings,
    reasons: reasonsSettings,
    optionalEmail: optionalEmailSettings,
  } = settings || {};
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [reasons, setReasons] = React.useState([] as ReasonsProps['settings']['items']);
  const [comment, setComment] = React.useState('');
  const [email, setEmail] = React.useState<string>();
  const { useTranslate, useUserMenu } = useThemeHooks();
  const { userData } = useUserMenu();
  const { translate } = useTranslate();

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value || undefined);
  };

  const onSubmitRatingForm = () => {
    onSubmit({
      score,
      comment,
      reasons,
      max: FEEDBACK_MAX_RATING,
      email,
    });
    setIsSubmitted(true);
  };

  const onCancelRatingForm = () => {
    setScore(0);
    setComment('');
    setReasons([]);
    setEmail(undefined);
  };

  const displayReasons = !!(score && reasonsSettings && !reasonsSettings.hide);
  const displayComment = !!(score && !commentSettings?.hide);
  const displaySubmitBnt = !!(score && (displayReasons || displayComment));
  const displayFeedbackEmail = !!score && !optionalEmailSettings?.hide && !userData.isAuthenticated;

  useEffect(() => {
    if (score && !displayComment && !displayReasons && !displayFeedbackEmail) {
      onSubmitRatingForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, displayComment, displayReasons, displayFeedbackEmail]);

  if (isSubmitted) {
    return (
      <RatingWrapper data-component-name="Feedback/Rating">
        <StyledFormMandatoryFields>
          <Label data-translation-key="feedback.settings.submitText">
            {submitText ||
              translate(
                'feedback.settings.submitText',
                'Thank you for helping improve our documentation!',
              )}
          </Label>
          <RadioCheckButtonIcon />
        </StyledFormMandatoryFields>
      </RatingWrapper>
    );
  }

  return (
    <RatingWrapper data-component-name="Feedback/Rating" className={className}>
      <StyledForm>
        <StyledFormMandatoryFields>
          <Label data-translation-key="feedback.settings.label">
            {label || translate('feedback.settings.label', 'Was this helpful?')}
          </Label>

          <StyledMandatoryFieldContainer>
            <Stars max={FEEDBACK_MAX_RATING} onChange={setScore} value={score} />
          </StyledMandatoryFieldContainer>
        </StyledFormMandatoryFields>
        {(displayReasons || displayComment) && (
          <StyledFormOptionalFields>
            {displayReasons && (
              <Reasons
                settings={{
                  label: reasonsSettings?.label,
                  items: reasonsSettings?.items || [],
                  component: reasonsSettings?.component,
                }}
                onChange={setReasons}
              />
            )}

            {displayComment && (
              <Comment
                standAlone={false}
                onSubmit={({ comment }) => setComment(comment)}
                settings={{
                  label:
                    commentSettings?.label ||
                    translate(
                      'feedback.settings.comment.label',
                      'Please share your feedback with us.',
                    ),
                }}
              />
            )}
          </StyledFormOptionalFields>
        )}

        {displayFeedbackEmail && (
          <StyledFormOptionalFields>
            <Label data-translation-key="feedback.settings.optionalEmail.label">
              {optionalEmailSettings?.label ||
                translate(
                  'feedback.settings.optionalEmail.label',
                  'Your email (optional, for follow-up)',
                )}
            </Label>
            <EmailInput
              onChange={onEmailChange}
              placeholder={
                optionalEmailSettings?.placeholder ||
                translate('feedback.settings.optionalEmail.placeholder', 'yourname@example.com')
              }
              type="email"
              required={!!email}
            />
          </StyledFormOptionalFields>
        )}

        {displaySubmitBnt && (
          <ButtonsContainer>
            <Button onClick={onCancelRatingForm} variant="text" size="small">
              Cancel
            </Button>
            <Button onClick={onSubmitRatingForm} variant="secondary" size="small">
              Submit
            </Button>
          </ButtonsContainer>
        )}
      </StyledForm>
    </RatingWrapper>
  );
}

const StyledForm = styled.form`
  width: 100%;
  gap: var(--spacing-sm);
  display: flex;
  flex-direction: column;
`;

const StyledFormOptionalFields = styled.div`
  display: flex;
  flex-flow: column;
`;

const StyledFormMandatoryFields = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-xs);
`;

const StyledMandatoryFieldContainer = styled.div`
  display: flex;
`;

const RatingWrapper = styled.div`
  font-family: var(--font-family-base);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.h4`
  font-family: var(--feedback-font-family);
  font-weight: var(--font-weight-regular);
  font-size: var(--feedback-header-font-size);
  line-height: var(--feedback-header-line-height);
  color: var(--feedback-header-text-color);
  margin: 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: var(--spacing-xxs);
  gap: var(--spacing-xxs);
`;

const EmailInput = styled.input`
  background-color: var(--bg-color);
  border-radius: var(--border-radius-lg);
  border: var(--input-border);
  outline: none;
  color: var(--feedback-text-color);
  font-family: var(--feedback-font-family);
  padding: 10px;
`;
