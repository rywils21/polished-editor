/** @jsx jsx */
import { jsx } from "theme-ui";
import { observer } from "mobx-react-lite";
import { AppData, AuthState } from "types";
import React, {
  useState,
  FormEvent,
  SetStateAction,
  Dispatch,
  ReactNode,
  useEffect,
} from "react";
import { firebase } from "misc/firebase";

import { useForm } from "@statickit/react";
import { Checkout } from "../Payments/Checkout";
import { Loader } from "components-ui/Loader";
import moment from "moment";

interface Props {
  data: AppData;
}

export const AccountBar = observer(function AccountBar({ data }: Props) {
  return (
    <div
      sx={{
        height: "420px",
        backgroundColor: "hsl(0, 0%, 36%)",
        color: "white",
        fontSize: 4,
        display: "flex",
      }}
    >
      {data.authState !== AuthState.AUTHENTICATED ? (
        <SignInBlock />
      ) : (
        <AccountContainer data={data} />
      )}
    </div>
  );
});

interface AccountBlockProps {
  data: AppData;
}

const AccountContainer = observer(function AccountContainer({
  data,
}: AccountBlockProps) {
  const [route, setRoute] = useState<
    "account" | "profile" | "support" | "feedback"
  >("account");

  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          backgroundColor: "hsl(0, 0%, 42%)",
        }}
      >
        <div>
          <ul
            sx={{
              listStyleType: "none",
              display: "flex",
              margin: 0,
              padding: 0,
              li: {
                marginRight: 2,
                marginLeft: 2,
                padding: 0,
                button: {
                  border: "none",
                  background: "none",
                  padding: 2,
                  color: "white",
                  fontSize: 3,
                  cursor: "pointer",
                },
              },
            }}
          >
            <li
              sx={{
                borderBottom:
                  route === "account"
                    ? "2px solid white"
                    : "2px solid transparent",
              }}
            >
              <button
                onClick={() => {
                  setRoute("account");
                }}
              >
                Account
              </button>
            </li>
            {/* <li
              sx={{
                borderBottom:
                  route === "profile"
                    ? "2px solid white"
                    : "2px solid transparent"
              }}
            >
              <button
                onClick={() => {
                  setRoute("profile");
                }}
              >
                Profile
              </button>
            </li> */}
            {data.computedSubscriptionInfo.activeTier === "pro" && (
              <li
                sx={{
                  borderBottom:
                    route === "support"
                      ? "2px solid white"
                      : "2px solid transparent",
                }}
              >
                <button
                  onClick={() => {
                    setRoute("support");
                  }}
                >
                  Support
                </button>
              </li>
            )}
            <li
              sx={{
                borderBottom:
                  route === "feedback"
                    ? "2px solid white"
                    : "2px solid transparent",
              }}
            >
              <button
                onClick={() => {
                  setRoute("feedback");
                }}
              >
                Feedback
              </button>
            </li>
          </ul>
        </div>
        <div sx={{ paddingRight: 3, display: "flex", alignItems: "center" }}>
          {data.computedSubscriptionInfo.activeTier === "pro" && (
            <div
              sx={{
                fontSize: 0,
                color: "hsl(0, 0%, 18%)",
                backgroundColor: "hsl(0, 0%, 78%)",
                padding: "2px",
                borderRadius: "4px",
                height: "16px",
              }}
            >
              PRO
            </div>
          )}
          <div sx={{ paddingLeft: 1, paddingRight: 3 }}>
            {data.userData.email}
          </div>

          <button
            sx={{ borderRadius: 1, border: "none", margin: 1 }}
            onClick={() => {
              firebase.signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
      {route === "account" && <AccountPage data={data} setRoute={setRoute} />}
      {route === "profile" && <ProfilePage />}
      {route === "support" && <SupportPage data={data} />}
      {route === "feedback" && <FeedbackPage data={data} />}
    </div>
  );
});

const AccountPage = observer(function AccountPage({
  data,
  setRoute,
}: {
  data: AppData;
  setRoute: Dispatch<
    SetStateAction<"account" | "profile" | "support" | "feedback">
  >;
}) {
  const [accountRoute, setAccountRoute] = useState<"default" | "upgrade">(
    "default"
  );

  useEffect(() => {
    console.log(
      "running account bar effect: ",
      data.computedSubscriptionInfo.activeTier,
      data.computedSubscriptionInfo.trialActive
    );
    if (
      data.computedSubscriptionInfo.activeTier === "pro" &&
      data.computedSubscriptionInfo.trialActive === false
    ) {
      setAccountRoute("default");
    }
  }, [
    data.computedSubscriptionInfo.activeTier,
    data.computedSubscriptionInfo.trialActive,
  ]);

  let content: ReactNode | null = null;
  if (accountRoute === "default") {
    if (
      data.computedSubscriptionInfo.activeTier === "basic" &&
      data.computedSubscriptionInfo.trialAvailable
    ) {
      content = (
        <BasicTrialAvailable data={data} setAccountRoute={setAccountRoute} />
      );
    } else if (
      data.computedSubscriptionInfo.activeTier === "basic" &&
      data.computedSubscriptionInfo.trialAvailable === false
    ) {
      content = <BasicNoTrial data={data} setAccountRoute={setAccountRoute} />;
    } else if (
      data.computedSubscriptionInfo.activeTier === "pro" &&
      data.computedSubscriptionInfo.trialActive
    ) {
      content = (
        <ProToolsTrialing
          data={data}
          setRoute={setRoute}
          setAccountRoute={setAccountRoute}
        />
      );
    } else if (
      data.computedSubscriptionInfo.activeTier === "pro" &&
      data.computedSubscriptionInfo.trialActive === false
    ) {
      content = <ProTools data={data} />;
    }
  } else if (accountRoute === "upgrade") {
    content = (
      <UpgradeToProTools
        data={data}
        setAccountRoute={setAccountRoute}
        setRoute={setRoute}
      />
    );
  }

  return (
    <div
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {content}
    </div>
  );
});

function BasicCard() {
  return (
    <div
      sx={{
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 5,
        backgroundColor: "hsl(0, 0%, 19%)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "380px",
      }}
    >
      <div sx={{ fontSize: 5, fontWeight: 700 }}>Basic</div>
      <div sx={{ fontSize: 3, fontStyle: "italic" }}>Free Forever</div>
      <div sx={{ fontSize: 1, marginTop: 4, textAlign: "center" }}>
        You're currently on the Basic tier of Polished. This provides the basic
        tools you need to start writing:
      </div>
      <div sx={{ fontSize: 1 }}>
        <ul>
          <li>Markdown Editor</li>
          <li>Configurable Modes</li>
          <li>Appearance Features</li>
        </ul>
      </div>
    </div>
  );
}

function ProCard() {
  return (
    <div
      sx={{
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 5,
        backgroundColor: "hsl(0, 0%, 19%)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div sx={{ fontSize: 5 }}>Pro Writing Tools</div>
      <div sx={{ fontSize: 1 }}>
        <ul>
          <li>Unlimited Workspaces</li>
          <li>Grammar Checking</li>
          <li>Advanced Configurable Features</li>
          <li>Dedicated Support</li>
        </ul>
      </div>
    </div>
  );
}

function ProAd() {
  return (
    <React.Fragment>
      <div sx={{ fontSize: 5, fontWeight: 700 }}>Pro Writing Tools</div>
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div sx={{ textDecoration: "line-through", fontSize: 4 }}>
          $29 one-time
        </div>
        <div sx={{ fontSize: 4, marginRight: 2 }}>$9 one-time</div>
      </div>
      <div sx={{ fontSize: 1 }}>
        <ul>
          <li>Unlimited Workspaces</li>
          <li>Grammar Checking</li>
          <li>Lifetime version upgrades</li>
          <li>Dedicated Support</li>
        </ul>
      </div>
    </React.Fragment>
  );
}

async function startTrial(data: AppData) {
  // TODO: set up authentication for these endpoints
  const response = await fetch(
    `${process.env.REACT_APP_FUNCTION_HOST}/user/start-trial`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.uid,
      }),
    }
  );
  const userData = await response.json();
  console.log("start trial userData: ", userData);
  data.userData = userData;
}

const BasicTrialAvailable = observer(function BasicTrialAvailable({
  data,
  setAccountRoute,
}: {
  data: AppData;
  setAccountRoute: Dispatch<SetStateAction<"default" | "upgrade">>;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div sx={{ display: "flex", height: "100%", width: "100%" }}>
      <BasicCard />
      <div sx={{ padding: 5, maxWidth: "420px" }}>
        <div sx={{ fontSize: 5 }}>Take your writing to the next level</div>
        <div sx={{ fontSize: 2, marginTop: 4 }}>
          Pro Writing Tools provides even more features to improve your writing
          process.
        </div>
        <div sx={{ fontSize: 2, marginTop: 4 }}>
          Activate your 7-day trial to Pro Writing Tools any time. No credit
          card required.
        </div>
      </div>
      <div
        sx={{
          padding: 3,
          paddingTop: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "hsl(0, 0%, 30%)",
          flex: 1,
        }}
      >
        <ProAd />
        <div sx={{ width: "340px" }}>
          <button
            sx={{ variant: "buttons.primary2" }}
            onClick={() => {
              setLoading(true);
              startTrial(data);
            }}
          >
            {loading ? <Loader /> : "Activate 7-day Free Trial"}
          </button>
        </div>
        <div sx={{ marginTop: 1 }}>
          <button
            sx={{ variant: "buttons.link" }}
            onClick={() => {
              setAccountRoute("upgrade");
            }}
          >
            or upgrade now
          </button>
        </div>
      </div>
    </div>
  );
});

const UpgradeToProTools = observer(function UpgradeToProTools({
  data,
  setRoute,
  setAccountRoute,
}: {
  data: AppData;
  setRoute: Dispatch<
    SetStateAction<"account" | "profile" | "support" | "feedback">
  >;
  setAccountRoute: Dispatch<SetStateAction<"default" | "upgrade">>;
}) {
  return (
    <div sx={{ display: "flex", width: "100%" }}>
      <div
        sx={{
          padding: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "hsl(0, 0%, 24%)",
        }}
      >
        <ProAd />
        <div
          sx={{
            position: "absolute",
            bottom: 0,
            padding: 3,
          }}
        >
          <button
            sx={{ variant: "buttons.link" }}
            onClick={() => {
              setAccountRoute("default");
            }}
          >
            Nevermind, don't upgrade
          </button>
        </div>
      </div>
      <div>
        <Checkout data={data} />
      </div>
      <div sx={{ padding: 2 }}>
        <button
          sx={{ variant: "buttons.link" }}
          onClick={() => {
            setRoute("support");
          }}
        >
          Having an issue upgrading?
        </button>
      </div>
    </div>
  );
});

const BasicNoTrial = observer(function BasicNoTrial({
  data,
  setAccountRoute,
}: {
  data: AppData;
  setAccountRoute: Dispatch<SetStateAction<"default" | "upgrade">>;
}) {
  const [state, submit] = useForm({
    site: "6a173aae2128",
    form: "trial-ended-form",
  });

  return (
    <div sx={{ display: "flex" }}>
      <BasicCard />
      <div sx={{ padding: 5 }}>
        <div sx={{ fontSize: 5 }}>Pro Trial Expired</div>
        <div sx={{ fontSize: 2, marginTop: 2 }}>
          Upgrade to access Pro Writing Tools again.
        </div>

        <div sx={{ width: "340px", marginTop: 2 }}>
          <button
            sx={{ variant: "buttons.primary2" }}
            onClick={() => {
              setAccountRoute("upgrade");
            }}
          >
            Upgrade Now
          </button>
        </div>
      </div>
      <div sx={{ padding: 5, maxWidth: "430px" }}>
        <div sx={{ fontSize: 5 }}>How's it going?</div>
        <div sx={{ fontSize: 2, marginTop: 2 }}>
          New features are added often. Send a message requesting a new trial if
          you want to try them out!
        </div>
        {state.succeeded ? (
          <div sx={{ width: "100%" }}>
            <p>Thank you! I'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div sx={{ visibility: "hidden", height: 0 }}>
              <input
                id="email"
                type="email"
                name="email"
                defaultValue={data.userData.email}
                placeholder="Your email address"
              />
            </div>
            <div>
              <textarea
                sx={{
                  height: 100,
                  width: "100%",
                  resize: "none",
                  boxSizing: "border-box",
                  marginTop: 3,
                  fontSize: 3,
                  padding: 2,
                }}
                id="message"
                name="message"
                placeholder="Your message here..."
              />
            </div>
            <button type="submit" sx={{ variant: "buttons.secondary" }}>
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
});

const ProToolsTrialing = observer(function ProToolsTrialing({
  data,
  setRoute,
  setAccountRoute,
}: {
  data: AppData;
  setRoute: Dispatch<
    SetStateAction<"account" | "profile" | "support" | "feedback">
  >;
  setAccountRoute: Dispatch<SetStateAction<"default" | "upgrade">>;
}) {
  const daysLeft = moment(data.computedSubscriptionInfo.trialExpires).fromNow(
    true
  );

  return (
    <div sx={{ display: "flex", width: "100%" }}>
      <div sx={{ padding: 5 }}>
        <div sx={{ fontSize: 5, fontWeight: 700 }}>
          {daysLeft} left in your trial
        </div>
        <div
          sx={{
            marginTop: 2,
            fontSize: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          Enjoying Pro Writing Tools?
          <div sx={{ paddingLeft: 1, paddingRight: 1 }}>
            <button
              sx={{ variant: "buttons.link" }}
              onClick={() => {
                setAccountRoute("upgrade");
              }}
            >
              Upgrade now
            </button>
          </div>
          to keep access.
        </div>
        <div sx={{ marginTop: 4, fontSize: 3 }}>
          Not loving it? Need support? Have a question?
        </div>
        <button
          sx={{ variant: "buttons.link" }}
          onClick={() => {
            setRoute("support");
          }}
        >
          Send us a message
        </button>
      </div>
      <div
        sx={{
          padding: 3,
          paddingTop: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "hsl(0, 0%, 30%)",
          flex: 1,
        }}
      >
        <ProAd />
        <div sx={{ width: "340px" }}>
          <button
            sx={{ variant: "buttons.primary2" }}
            onClick={() => {
              setAccountRoute("upgrade");
            }}
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
});

const ProTools = observer(function ProTools({ data }: { data: AppData }) {
  const [state, submit] = useForm({
    site: "6a173aae2128",
    form: "feedback-form",
  });
  return (
    <div sx={{ display: "flex" }}>
      <ProCard />
      <div sx={{ padding: 3, maxWidth: "450px" }}>
        {state.succeeded ? (
          <div>Thank you for the message! We'll be in touch soon.</div>
        ) : (
          <div>
            <div sx={{ fontSize: 2 }}>
              Need help? Have a feature request? Send us a message and we'll get
              back to you as soon as possible.
            </div>

            <form onSubmit={submit}>
              <div sx={{ visibility: "hidden", maxHeight: 0 }}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={data.userData.email}
                  readOnly={true}
                  placeholder="Your email address"
                />
              </div>
              <div
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 2,
                }}
              >
                <textarea
                  sx={{
                    height: 200,
                    resize: "none",
                    padding: 2,
                    marginTop: 2,
                    fontSize: 3,
                    borderRadius: "4px",
                    border: "none",
                  }}
                  id="message"
                  name="message"
                  placeholder="Your message here..."
                />
              </div>
              <button sx={{ variant: "buttons.primary2" }} type="submit">
                {state.submitting ? <Loader /> : "Send Feedback"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
});

const ProfilePage = observer(function ProfilePage() {
  return <div>Profile</div>;
});

interface SupportProps {
  data: AppData;
}
const SupportPage = observer(function SupportPage({ data }: SupportProps) {
  const [state, submit] = useForm({
    site: "6a173aae2128",
    form: "support-form",
  });

  if (state.succeeded) {
    return (
      <div sx={{ width: "100%", textAlign: "center" }}>
        <p>
          Thank you for submitting a support request. I'll be in touch as soon
          as possible!
        </p>
      </div>
    );
  }

  return (
    <div sx={{ padding: 4, display: "flex" }}>
      <div sx={{ paddingRight: 4, width: "400px" }}>
        <div sx={{ fontSize: 5 }}>We're here to help!</div>
        <div sx={{ fontSize: 1 }}>
          Ask a question or tell us about your problem. We'll reply to your
          email address as soon as possible.
        </div>
      </div>
      <form onSubmit={submit} sx={{ width: "400px" }}>
        <div sx={{ visibility: "hidden", maxHeight: 0 }}>
          <input
            id="email"
            type="email"
            name="email"
            defaultValue={data.userData.email}
            placeholder="Your email address"
          />
        </div>
        <div sx={{ display: "flex", flexDirection: "column", marginBottom: 2 }}>
          <textarea
            sx={{
              height: 200,
              resize: "none",
              padding: 2,
              marginTop: 2,
              fontSize: 3,
              borderRadius: "4px",
              border: "none",
            }}
            id="message"
            name="message"
            placeholder="Your message here..."
          />
        </div>
        <button sx={{ variant: "buttons.primary2" }} type="submit">
          {state.submitting ? <Loader /> : "Submit"}
        </button>
      </form>
    </div>
  );
});

interface FeedbackProps {
  data: AppData;
}
const FeedbackPage = observer(function FeedbackPage({ data }: FeedbackProps) {
  const [state, submit] = useForm({
    site: "6a173aae2128",
    form: "feedback-form",
  });
  if (state.succeeded) {
    return (
      <div sx={{ width: "100%", textAlign: "center" }}>
        <p>Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <div sx={{ padding: 4, display: "flex" }}>
      <div sx={{ paddingRight: 4, width: "400px" }}>
        <div sx={{ fontSize: 5 }}>Tell us what you think</div>
        <div sx={{ fontSize: 1 }}>
          What can Polished do better? What are you loving? Send feedback in the
          box to the right.
        </div>
      </div>
      <form onSubmit={submit} sx={{ width: "400px" }}>
        <div sx={{ visibility: "hidden", maxHeight: 0 }}>
          <input
            id="email"
            type="email"
            name="email"
            defaultValue={data.userData.email}
            placeholder="Your email address"
          />
        </div>
        <div sx={{ display: "flex", flexDirection: "column", marginBottom: 2 }}>
          <textarea
            sx={{
              height: 200,
              resize: "none",
              padding: 2,
              marginTop: 2,
              fontSize: 3,
              borderRadius: "4px",
              border: "none",
            }}
            id="message"
            name="message"
            placeholder="Your message here..."
          />
        </div>
        <button sx={{ variant: "buttons.primary2" }} type="submit">
          {state.submitting ? <Loader /> : "Send Feedback"}
        </button>
      </form>
    </div>
  );
});

function SignInBlock() {
  const [signInState, setSignInState] = useState<"create" | "signin">("create");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  function toggleSignInState() {
    setEmail("");
    setPassword("");
    setError("");
    setSignInState((s) => (s === "create" ? "signin" : "create"));
  }

  const errorMessages = {
    "auth/email-already-in-use":
      "That email is not available. Did you mean to login?",
    "auth/weak-password":
      "That password is too weak. Please make sure it as least 6 characters.",
    "auth/wrong-password": "Email or password is incorrect. Please try again.",
    "auth/user-not-found": "Email or password is incorrect. Please try again.",
    default: "Something went wrong creating your account. Please try again.",
  };

  function getErrorMessage(code: string) {
    if (errorMessages.hasOwnProperty(code)) {
      // @ts-ignore
      return errorMessages[code];
    } else {
      return errorMessages.default;
    }
  }

  return (
    <React.Fragment>
      <div
        sx={{
          paddingRight: 6,
          paddingLeft: 6,
          paddingTop: 3,
          backgroundColor: "hsl(0, 0%, 19%)",
          minWidth: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div sx={{ fontSize: 5 }}>
          {signInState === "create" ? "Create Account" : "Welcome Back"}
        </div>
        <form
          onSubmit={async (evt: FormEvent) => {
            evt.preventDefault();
            setLoading(true);
            let errorCode = "";
            if (signInState === "create") {
              // TODO: get response from this
              const result = await firebase.createEmailAccount(email, password);
              console.log("success case: ", result);
              if (!result.user && result.code) {
                errorCode = result.code;
              }
            } else {
              // TODO: get response from this
              const result = await firebase.signInWithEmailAccount(
                email,
                password
              );
              console.log("success case: ", result);
              if (!result.user && result.code) {
                errorCode = result.code;
              }
            }
            if (errorCode !== "") {
              setError(errorCode);
              setLoading(false);
            }
          }}
          sx={{ minWidth: "280px" }}
        >
          <div sx={{ marginTop: 3, width: "100%" }}>
            <div sx={{ fontSize: 1 }}>Email</div>
            <input
              sx={{
                variant: "inputs.singleLine",
              }}
              type="email"
              onChange={(evt) => setEmail(evt.target.value)}
              value={email}
            />
          </div>
          <div sx={{ marginTop: 3, width: "100%" }}>
            <div sx={{ fontSize: 1 }}>Password</div>
            <input
              sx={{
                variant: "inputs.singleLine",
              }}
              type="password"
              onChange={(evt) => setPassword(evt.target.value)}
              value={password}
            />
          </div>
          {error && (
            <div sx={{ margin: 2, color: "red", fontSize: 2 }}>
              {getErrorMessage(error)}
            </div>
          )}
          <div sx={{ width: "100%", marginTop: 4 }}>
            <button
              sx={{
                variant: "buttons.primary2",
              }}
              type="submit"
            >
              {loading ? (
                <Loader />
              ) : signInState === "create" ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <button
          sx={{
            border: "none",
            background: "none",
            color: "hsl(0, 0%, 95%)",
            textDecoration: "underline",
            width: "100%",
            marginTop: 2,
          }}
          onClick={toggleSignInState}
        >
          {signInState === "create"
            ? "Already have an account?"
            : "Don't have an account?"}
        </button>
      </div>

      <div sx={{ paddingLeft: 6, paddingTop: 3, maxWidth: "500px" }}>
        <div sx={{ fontSize: 6, fontWeight: 700 }}>
          Get the most out of Polished
        </div>
        <p sx={{ fontSize: 2 }}>
          After creating an account, you can activate your free trial to Pro
          Writing Tools whenever you're ready to try it.
        </p>
        <p sx={{ fontSize: 2 }}>
          Pro Writing Tools provides access to features like:
        </p>
        <div sx={{ fontSize: 2 }}>
          <ul>
            <li>Grammar Checking</li>
            <li>Sentence Variation</li>
            <li>Unlimited Workspaces</li>
            <li>Dedicated Support</li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}
