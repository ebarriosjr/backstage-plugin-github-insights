/*
 * Copyright 2020 RoadieHQ
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { FC } from 'react';
import { Chip, makeStyles, Tooltip } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { InfoCard, Progress } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { useProjectEntity } from '../../useProjectEntity';
import { useRequest } from '../../useRequest';
import { colors } from './colors';

const useStyles = makeStyles(theme => ({
  infoCard: {
    marginBottom: theme.spacing(3),
    '& + .MuiAlert-root': {
      marginTop: theme.spacing(3),
    },
  },
  barContainer: {
    height: theme.spacing(2),
    marginBottom: theme.spacing(3),
    borderRadius: '4px',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    position: 'relative',
  },
  languageDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginRight: theme.spacing(1),
    display: 'inline-block',
  },
  label: {
    color: 'inherit',
  }
}));

type Language = {
  [key: string]: number;
};

type LanguageCardProps = {
  entity: Entity;
};

const LanguagesCard: FC<LanguageCardProps> = ({ entity }) => {
  let barWidth = 0;
  const { owner, repo } = useProjectEntity(entity);
  const classes = useStyles();
  const { value, loading, error } = useRequest(entity, 'languages', 0, 0, true);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error" className={classes.infoCard}>{error.message}</Alert>;
  }
  return value && owner && repo ? (
    <InfoCard title="Languages" className={classes.infoCard}>
      <div className={classes.barContainer}>
        {
          Object.entries(value.data as Language).map((language, index: number) => {
            barWidth = barWidth + ((language[1] / value.total) * 100);
            return (
              <Tooltip title={ language[0] } placement="bottom-end" key={language[0]}>
                <div
                  className={classes.bar}
                  key={ language[0] }
                  style={
                    {
                      marginTop: index === 0 ? '0' : `-16px`,
                      zIndex: Object.keys(value.data).length - index,
                      backgroundColor: colors[(language[0])]?.color || '#333',
                      width: `${barWidth}%`,
                    }
                  }
                />
              </Tooltip>
            );
          })
        }
      </div>
      {Object.entries(value.data as Language).map(language => (
        <Chip
        classes={{
          label: classes.label
        }}
          label={
            <>
              <span
                className={classes.languageDot}
                style={ {
                  backgroundColor: colors[(language[0])]?.color || '#333',
                }} /> 
                {language[0]} - {((language[1] / value.total) * 100).toFixed(2)}%
            </>
          }
          variant="outlined"
          key={language[0]}
        />
      ))}
    </InfoCard>
  ) : null;
};

export default LanguagesCard;
