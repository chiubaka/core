"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_redux_1 = require("react-redux");
function withPageAnalytics(WrappedComponent) {
    class Page extends React.Component {
        componentDidMount() {
            const path = this.props.location.pathname;
            const params = this.props.location.search;
            if (this.props.enableFacebookAnalytics) {
                window.fbq("track", "ViewContent", { content_name: `${path}${params}` });
            }
            if (this.props.googleAnalyticsId) {
                window.gtag("config", this.props.googleAnalyticsId, { page_path: `${path}${params}` });
            }
        }
        render() {
            return (React.createElement(WrappedComponent, Object.assign({}, this.props)));
        }
    }
    function mapStateToProps(state) {
        return state.analytics;
    }
    return react_redux_1.connect(mapStateToProps)(Page);
}
exports.withPageAnalytics = withPageAnalytics;
//# sourceMappingURL=PageAnalytics.js.map