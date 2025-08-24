import { IconComponent } from '../../src/types/misc/iconComponent';
import LocationIcon from '../../components/Icons/LocationIcon';
import BedIcon from '../../components/Icons/BedIcon';
import BathIcon from '../../components/Icons/BathIcon';
import ParkingIcon from '../../components/Icons/ParkingIcon';
import SizeIcon from '../../components/Icons/SizeIcon';
import KitchenIcon from '../../components/Icons/KitchenIcon';
import TvIcon from '../../components/Icons/TvIcon';
import WifiIcon from '../../components/Icons/WifiIcon';
import LibraryIcon from '../../components/Icons/LibraryIcon';
import SnowFlakeIcon from '../../components/Icons/SnowFlakeIcon';
import EyeIcon from '../../components/Icons/EyeIcon';
import GuardIcon from '../../components/Icons/GuardIcon';
import SwimIcon from '../../components/Icons/SwimIcon';
import BoxIcon from '../../components/Icons/BoxIcon';
import SofaIcon from '../../components/Icons/SofaIcon';
import TemperatureIcon from '../../components/Icons/TemperatureIcon';
import BownRiceIcon from '../../components/Icons/BownRiceIcon';
import LockIcon from '../../components/Icons/LockIcon';
import DoorOpenIcon from '../../components/Icons/DoorOpenIcon';
import ClubIcon from '../../components/Icons/ClubIcon';
import DumbbellIcon from '../../components/Icons/DumbbellIcon';
import FootballIcon from '../../components/Icons/FootballIcon';
import CityIcon from '../../components/Icons/CityIcon';
import VanIcon from '../../components/Icons/VanIcon';
import PlugIcon from '../../components/Icons/PlugIcon';
import FaucetIcon from '../../components/Icons/FaucetIcon';
import GroundWaterIcon from '../../components/Icons/GroundWaterIcon';
import TowerCell from '../../components/Icons/TowerCell';
import WaterIcon from '../../components/Icons/WaterIcon';
import StoreIcon from '../../components/Icons/StoreIcon';
import TreeIcon from '../../components/Icons/TreeIcon';
import HouseLaptopIcon from '../../components/Icons/HouseLaptopIcon';
import WindIcon from '../../components/Icons/Wind';
import ArrowSpin from '../../components/Icons/ArrowSpinIcon';
import WalkinClosetIcon from '../../components/Icons/WalkinClosetIcon';
import StudioRoomIcon from '../../components/Icons/StudioRoomIcon';
import MailboxIcon from '../../components/Icons/Mailbox';
import ChairIcon from '../../components/Icons/ChairIcon';
import EatIcon from '../../components/Icons/EatIcon';

interface Icons {
  [key: string]: IconComponent;
}

const icons: Icons = {
  location: LocationIcon,
  studio: StudioRoomIcon,
  beds: BedIcon,
  baths: BathIcon,
  parkings: ParkingIcon,
  size: SizeIcon,
  kitchens: KitchenIcon,
  livings: TvIcon,
  wifi: WifiIcon,
  library: LibraryIcon,
  ac: TemperatureIcon,
  cctv: EyeIcon,
  guard: GuardIcon,
  pool: SwimIcon,
  laundry: ArrowSpin,
  wardrobe: BoxIcon,
  walkinC: WalkinClosetIcon,
  sofa: SofaIcon,
  tv: TvIcon,
  fridge: SnowFlakeIcon,
  microwave: BownRiceIcon,
  ddl: LockIcon,
  balcony: DoorOpenIcon,
  club: ClubIcon,
  fitness: DumbbellIcon,
  playground: FootballIcon,
  rooftop: CityIcon,
  van: VanIcon,
  electric: PlugIcon,
  pipedWater: FaucetIcon,
  groundWater: GroundWaterIcon,
  signal: TowerCell,
  community: ClubIcon,
  canal: WaterIcon,
  pond: WaterIcon,
  commercial: StoreIcon,
  lobby: SofaIcon,
  garden: TreeIcon,
  cowork: HouseLaptopIcon,
  waterheat: WaterIcon,
  eStove: KitchenIcon,
  hood: WindIcon,
  mailbox: MailboxIcon,
  table1: EatIcon,
  table2: HouseLaptopIcon,
  table3: ChairIcon
};

const getIcon = (iconName: string): IconComponent => {
  return icons[iconName] ?? LocationIcon;
};

export { getIcon };
