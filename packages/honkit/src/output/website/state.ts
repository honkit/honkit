import I18n from "i18n-t";
import Immutable from "immutable";

type Resources = Immutable.Map<any, any>;

class GeneratorState extends Immutable.Record({
    i18n: I18n(),
    // List of plugins' resources
    resources: Immutable.Map()
}) {
    getI18n(): I18n {
        return this.get("i18n");
    }

    getResources(): Resources {
        return this.get("resources");
    }
}

export default GeneratorState;
