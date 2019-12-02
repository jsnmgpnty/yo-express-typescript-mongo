"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the astounding ${chalk.red(
          "generator-jama-express-mongo-ts"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "What is the name of your project?",
        default: "my-awesome-express-app"
      },
      {
        type: "input",
        name: "description",
        message: "Give us some small description of your project",
        default: ""
      },
      {
        type: "input",
        name: "author",
        message: "Who is the author of this project?",
        default: ""
      },
      {
        type: "input",
        name: "appTitle",
        message: "What is the title of your project?",
        default: ""
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    // Copy public files
    this.fs.copyTpl(
      this.templatePath("public/index.html"),
      this.destinationPath(`${this.props.name}/public/index.html`),
      {
        appTitle: this.props.name,
        description: this.props.description,
        author: this.props.author
      }
    );

    // Copy server common files
    this.fs.copyTpl(
      this.templatePath("server/common/server.ts"),
      this.destinationPath(`${this.props.name}/server/common/server.ts`),
      {
        appName: this.props.name,
      }
    );

    // Copy server api files
    this.fs.copy(
      this.templatePath("server/api/**/*"),
      this.destinationPath(`${this.props.name}/server/api/**/*`)
    );

    // Copy tests
    this.fs.copy(
      this.templatePath("test/**/*"),
      this.destinationPath(`${this.props.name}/test`)
    );

    // Copy config files
    this.fs.copy(
      this.templatePath("_.env"),
      this.destinationPath(`${this.props.name}/.env`)
    );
    this.fs.copy(
      this.templatePath("_.eslintrc.js"),
      this.destinationPath(`${this.props.name}/.eslintrc.js`)
    );
    this.fs.copy(
      this.templatePath("_.gitignore"),
      this.destinationPath(`${this.props.name}/.gitignore`)
    );
    this.fs.copy(
      this.templatePath("_.prettierrc.js"),
      this.destinationPath(`${this.props.name}/.prettierrc.js`)
    );
    this.fs.copy(
      this.templatePath("build.ts"),
      this.destinationPath(`${this.props.name}/build.ts`)
    );
    this.fs.copy(
      this.templatePath("nodemon.json"),
      this.destinationPath(`${this.props.name}/nodemon.json`)
    );
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath(`${this.props.name}/package.json`),
      {
        name: this.props.name,
        description: this.props.description,
        author: this.props.author
      }
    );
    this.fs.copy(
      this.templatePath("tsconfig.json"),
      this.destinationPath(`${this.props.name}/tsconfig.json`)
    );
    this.fs.copy(
      this.templatePath("tsoa.json"),
      this.destinationPath(`${this.props.name}/tsoa.json`)
    );
  }

  install() {
    var npmdir = `${process.cwd()}/${this.props.name}`;
    process.chdir(npmdir);
    this.installDependencies({
      bower: false
    });
  }
};
