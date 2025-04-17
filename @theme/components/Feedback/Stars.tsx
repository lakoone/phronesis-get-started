import * as React from 'react';
import styled from 'styled-components';

import { StarIcon } from '@redocly/theme/icons/StarIcon/StarIcon';
import { StarFilledIcon } from '@redocly/theme/icons/StarFilledIcon/StarFilledIcon';

export type StarsProps = {
  max?: number;
  name?: string;
  value?: number;
  onChange: (value: number) => void;
};

export function Stars({ max = 5, onChange, value }: StarsProps): JSX.Element {
  const [hovered, setHovered] = React.useState(value || 0);
  const stars: JSX.Element[] = [];

  for (let index = 1; index <= max; index++) {
    stars.push(
      <Star
        data-testid={`star-${index}`}
        key={index}
        onClick={() => onChange(index)}
        onMouseOver={() => setHovered(index)}
        onMouseLeave={() => !value && setHovered(0)}
      >
        {hovered < index ? (
          <StarIcon color="var(--feedback-star-color)" />
        ) : (
          <StarFilledIcon color="var(--feedback-star-color)" />
        )}
      </Star>,
    );
  }

  return <StarsWrapper data-component-name="Feedback/Stars">{stars}</StarsWrapper>;
}

const StarsWrapper = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  flex-direction: row;
  align-items: center;
`;

const Star = styled.button.attrs(() => ({
  type: 'button',
}))`
  cursor: pointer;
  padding: 0;
  border: none;
  background-color: transparent;
  height: 16px;
  gap: var(--spacing-xs);
`;
