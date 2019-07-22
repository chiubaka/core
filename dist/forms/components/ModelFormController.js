"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
function withModelFormController(WrappedComponent, Api, defaultModelState = {}) {
    class ModelFormController extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                model: Object.assign({}, defaultModelState, props.model),
            };
            this.updateModelState = this.updateModelState.bind(this);
            this.submitForm = this.submitForm.bind(this);
            this.resetForm = this.resetForm.bind(this);
        }
        render() {
            return (React.createElement(WrappedComponent, Object.assign({}, this.props, this.state, { onModelDetailsUpdate: this.updateModelState, onSubmit: this.submitForm, onFormReset: this.resetForm })));
        }
        updateModelState(model) {
            this.setState(Object.assign({}, this.state, { model: Object.assign({}, this.state.model, model) }));
        }
        submitForm() {
            return this.props.onSubmit(this.props.model, this.state.model).then((model) => {
                return model;
            });
        }
        resetForm() {
            this.setState({ model: defaultModelState });
        }
    }
    function mapDispatchToProps(dispatch) {
        return {
            onSubmit: (original, updated) => {
                const promise = dispatch(Api.createOrUpdate(original, updated));
                return promise;
            },
        };
    }
    return react_redux_1.connect(null, mapDispatchToProps)(ModelFormController);
}
exports.withModelFormController = withModelFormController;

//# sourceMappingURL=../../dist/forms/components/ModelFormController.js.map
