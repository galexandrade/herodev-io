import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"

class IndexPage extends React.Component {
  render() {
    const siteTitle = "Hero Dev"

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Home"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <img style={{ margin: 0 }} src="./assets/HeroDevLogo.svg" alt="Logo" />
        <h1>
          Hi devs{" "}
          <span role="img" aria-label="wave emoji">
            👋
          </span>
        </h1>
        <p>Welcome to my blog. </p>
        <p>
          All of us, devs, master superpowers. A lot of times we save the day
          solving hard problems with code, but we forget others might face the
          same problem as well and we can empower them with the same solution.
          The goal here is to share great content with the dev community that
          can help you on your hero journey.
        </p>
        <p>Let's save the day with code!</p>
        <Link to="/blog/">
          <Button marginTop="35px">Go to Blog</Button>
        </Link>
      </Layout>
    )
  }
}

export default IndexPage
