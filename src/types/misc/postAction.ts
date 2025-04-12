import { IconComponent } from './iconComponent';

export interface PostAction {
  id: string;
  label: string;
  icon: IconComponent;
  iconBackground: 'green' | 'yellow' | 'gray';
}
