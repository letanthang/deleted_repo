/** Mod by Thang */
import variable from "./../variables/platform";
import { Theme } from '../../src/Styles';

export default (variables = variable) => {
  const cardTheme = {
    ".transparent": {
      shadowColor: null,
      shadowOffset: null,
      shadowOpacity: null,
      shadowRadius: null,
      elevation: null
    },
    marginVertical: 5,
    marginHorizontal: 2,
    flex: 1,
    // borderWidth: variables.borderWidth,
    borderWidth: 0,
    // borderRadius: 2,
    borderRadius: Theme === 'dark' ? 5 : 2,
    borderColor: variables.cardBorderColor,
    flexWrap: "wrap",
    backgroundColor: variables.cardDefaultBg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    // elevation: 3,
    elevation: Theme === 'dark' ? 0 : 3
  };

  return cardTheme;
};
