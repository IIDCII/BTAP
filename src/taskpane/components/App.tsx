import * as React from "react";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import { makeStyles } from "@fluentui/react-components";
import { Table24Regular, Edit24Regular, CommentEdit24Regular, ErrorCircle24Regular } from "@fluentui/react-icons";
import OpenAIChat from "./APIHandler";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    maxWidth: "90%",
    alignItems: "center",
    flexDirection: "column",
    display: "flex",
  },
  footer: {
    width: "100%",
    textAlign: "center",
    paddingBottom: "10px",
  },
});

const App: React.FC<AppProps> = (props: AppProps) => {
  const styles = useStyles();

  // change this so that it's a short tutorial on how to use the add-in
  const listItems: HeroListItem[] = [
    {
      icon: <Table24Regular />,
      primaryText: "make sure the blood donoation and patient data is in the current spreadsheet and is clearly labeled",
    },
    {
      icon: <Edit24Regular />,
      primaryText: "Select the cell that you want the response to be inserted into (the top left corner of the table)",
    },
    {
      icon: <CommentEdit24Regular />,
      primaryText: "Add any additional information for pairing if needed. E.g. 'I want only the id's of the pairings'",
    },
    {
      icon: <ErrorCircle24Regular />,
      primaryText: "Reload the add-in if it's not working and make sure to save your sheet before using the add-in. Make sure that the pairings are always up to date.",
    },
  ];

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" title={props.title} message="Blood Transfusion Automated Pairing" />
      {/* <TextInsertion insertText={insertText} /> */}

      <br />

      <OpenAIChat />

      <br />

      <HeroList message="How to use:" items={listItems} />

      <footer className={styles.footer}>
      <p>&copy; 2024 BTAP. All rights reserved.</p>
      <p>
        <a href="/assets/privacy_policy.md">Privacy Policy</a> | <a href="/assets/terms_of_service.md">Terms of Service</a>
      </p>
    </footer>
    </div>
  );
};

export default App;
