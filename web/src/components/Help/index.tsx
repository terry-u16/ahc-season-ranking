import { type FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';

const HelpView: FC = () => {
  return (
    <Box px={1} py={2}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h5">概要</Typography>
          <Typography variant="body1">
            AtCoderで行われたRated
            AHCのうち、指定した期間に開催されたコンテストのみを対象とした仮想的なレーティングを計算する非公式ツールです。
          </Typography>
          <Typography variant="body1">
            順位タブから指定した期間のレーティングランキングを、個人成績タブからその期間の個人成績を確認できます。
          </Typography>
          <Typography variant="body1">
            コンテスト参加のモチベーションアップ等にお役立てください。
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h5">集計条件設定</Typography>
          <Typography variant="h6">期間指定</Typography>
          <Typography variant="body1">
            レーティング集計対象の期間を指定できます。
          </Typography>
          <Typography variant="body1">
            「全期間」を選ぶと、全てのRatedコンテストが集計対象となります。
          </Typography>
          <Typography variant="body1">
            「xxxx年」を選ぶと、指定した年のRatedコンテストのみが集計対象となります。
          </Typography>
          <Typography variant="body1">
            集計期間を任意に指定することもできます。
          </Typography>
          <Typography variant="h6">短期・長期指定</Typography>
          <Typography variant="body1">
            レーティング集計対象の期間を短期コンテストのみ・長期コンテストのみに絞ることができます。
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h5">順位タブ</Typography>
          <Typography variant="body1">
            指定された集計条件でのレーティングランキングを表示します。
          </Typography>
          <Typography variant="body1">
            右上の検索ボックスにユーザー名を入力すると、条件に一致した行のみが表示されます。
          </Typography>
          <Typography variant="body1">
            行をクリックすると、個人成績タブにそのユーザーの成績が表示されます。
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h5">個人成績タブ</Typography>
          <Typography variant="body1">
            指定したユーザーの期間内の成績を表示します。
          </Typography>
          <Typography variant="body1">
            シェアボタンを押すと、そのユーザーの成績をXで共有できます。
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h5">その他</Typography>
          <Typography variant="body1">
            このページは
            <a
              href="https://twitter.com/terry_u16"
              target="_blank"
              rel="noopener noreferrer"
            >
              terry_u16
            </a>
            が作成しました。
          </Typography>
          <Typography variant="body1">
            開発は
            <a
              href="https://github.com/terry-u16/ahc-season-rankings"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            上で行っています。要望・バグ・コンテストの追加忘れ等があればそちらにお願いします。
          </Typography>
          <Typography variant="body1">
            このツールは非公式であり、AtCoder様とは一切関係ありません。AtCoder様に問い合わせを行うことはお控えください。
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default HelpView;
