import { Providers } from './providers';
import { RootNavigator } from '../presentation/navigation/root-navigator';

export default function App() {
  return (
    <Providers>
      <RootNavigator />
    </Providers>
  );
}
