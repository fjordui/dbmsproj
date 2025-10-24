import { authAction } from "@/app/_lib/actions";
import CredentialsForm from "../CredentialsForm";
import styles from "./styles.module.css";

function SigninForm() {
  return (
    <div className={`${styles.formSection} container`}>
      <CredentialsForm authAction={authAction} />
    </div>
  );
}

export default SigninForm;
