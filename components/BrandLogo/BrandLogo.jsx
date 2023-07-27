import styles from "./BrandLogo.module.css"

const BrandLogo = (props) => {
  return (
    <figure className={styles.logo} {...props}>
      <span>D</span>
      <span>L</span>
      <span>C</span>
      <span>M</span>
    </figure>
  )
}

export default BrandLogo
