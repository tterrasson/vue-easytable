import LZString from "lz-string";

export default {
    props: {
        btnName: {
            type: String,
            required: true
        },
        // vue-easytable version
        version: {
            type: String,
            required: true
        },
        // vue tpl
        exampleTpl: {
            type: String,
            required: true
        },
        // scripts
        exampleScript: {
            type: String,
            default: ""
        },
        // style
        exampleStyle: {
            type: String,
            required: true
        }
    },
    methods: {
        // get main js content
        getMainjsContent() {
            return `
import Vue from "vue";
import Example from "./Example.vue";

Vue.config.productionTip = false;

// import default theme
import "vue-easytable/libs/theme-default/index.css";
// import vue-easytable library
import VueEasytable from "vue-easytable";

Vue.use(VueEasytable);

new Vue({
  render: (h) => h(Example)
}).$mount("#app");
            `;
        },

        // get example.vue content
        getExampleContent() {
            return `
            ${this.exampleTpl}

            <script>
             ${this.exampleScript}
            </script>

            <style>
            ${this.exampleStyle}
            </style>
            `;
        },

        getCodesanboxPrefillConfig() {
            const { version, getExampleContent, getMainjsContent } = this;

            const codesandboxPackage = {
                title: `vue-easytable@${version} example`,
                main: "main.js",
                dependencies: {
                    "@vue/cli-plugin-babel": "4.5.11",
                    vue: "^2.6.11",
                    "vue-easytable": version
                },
                devDependencies: {
                    "@vue/cli-plugin-eslint": "4.1.1",
                    "@vue/cli-service": "4.1.1",
                    "vue-template-compiler": "^2.6.11"
                },
                scripts: {
                    serve: "vue-cli-service serve",
                    build: "vue-cli-service build",
                    lint: "vue-cli-service lint"
                },
                browserslist: ["> 1%", "last 2 versions", "not ie <= 8"]
            };

            const codesanboxPrefillConfig = {
                files: {
                    "package.json": { content: codesandboxPackage },
                    "Example.vue": { content: getExampleContent() },
                    "main.js": { content: getMainjsContent() }
                }
            };

            return codesanboxPrefillConfig;
        }
    },
    render() {
        const { getCodesanboxPrefillConfig, btnName } = this;

        function compress(string) {
            return LZString.compressToBase64(string)
                .replace(/\+/g, "-") // Convert '+' to '-'
                .replace(/\//g, "_") // Convert '/' to '_'
                .replace(/=+$/, ""); // Remove ending '='
        }

        const fromProps = {
            ref: "form"
        };

        return (
            <div>
                <form
                    {...fromProps}
                    action="https://codesandbox.io/api/v1/sandboxes/define"
                    method="POST"
                    target="_blank"
                    onClick={() => {
                        console.log(getCodesanboxPrefillConfig());
                        this.$refs[fromProps.ref].submit();
                    }}
                >
                    <input
                        type="hidden"
                        name="parameters"
                        value={compress(
                            JSON.stringify(getCodesanboxPrefillConfig())
                        )}
                    />
                    { btnName }
                </form>
            </div>
        );
    }
};
