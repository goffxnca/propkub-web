import { DropdownOption } from '../../types/misc/dropdownOption';

const getDropdownOptions = (total: number): DropdownOption[] => {
  const baseOption: DropdownOption = { id: 0, label: '0' };
  const options: DropdownOption[] = Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    label: String(i + 1)
  }));
  return [baseOption, ...options];
};

export { getDropdownOptions };
