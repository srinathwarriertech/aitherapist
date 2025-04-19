import Head from 'next/head'
import Image from 'next/image'
import styles from '../../../styles/Questionnaire.module.css'

const Questionnaire: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Spring - Questionnaire</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <Image src="/logo.svg" alt="Spring Logo" width={30} height={30} />
          </div>
          <div className={styles.headerRight}>
            <button className={styles.languageButton}>EN</button>
            <button className={styles.helpButton}>Help</button>
          </div>
        </header>

        <section className={styles.content}>
          <div className={styles.iconContainer}>
            <Image src="/plant-icon.svg" alt="Plant Icon" width={60} height={60} />
          </div>
          <h1 className={styles.title}>Lenora, tell us what brings you to Spring.</h1>
          <p className={styles.timeEstimate}>3 - 5 minutes</p>

          <ul className={styles.instructions}>
            <li>We&apos;re going to ask a series of questions to match you with the right care and personalize your experience.</li>
            <li>Your answers will only be seen by our care team to assess your mental health and understand your goals.</li>
            <li>Some of these questions may not apply to you - that&apos;s okay! Answer the best you can.</li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default Questionnaire
