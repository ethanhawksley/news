interface Document {
  prerendering?: boolean;
}

interface Navigator {
  readonly connection?: NetworkInformation;
}

interface NetworkInformation {
  readonly saveData?: boolean;
}
