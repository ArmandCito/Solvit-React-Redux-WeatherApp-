export interface NavbarProps {
  onSearch: (city: string) => void;
  onLocate: () => void;
  loading: boolean;
}
