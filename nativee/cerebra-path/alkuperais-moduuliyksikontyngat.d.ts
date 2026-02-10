declare module '@react-native-masked-view/masked-view' {
  import React from 'react';
  import { ViewProps } from 'react-native';

  export interface MaskedViewProps extends ViewProps {
    maskElement: React.ReactElement;
    children: React.ReactNode;
  }

  export default class MaskedView extends React.Component<MaskedViewProps> {}
}