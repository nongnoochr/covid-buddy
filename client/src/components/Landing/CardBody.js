import classes from './CardBody.module.css';

const CardBody = (props) => {

    return (<div className={classes['card-body-container']}>
        <h5>{ props.title }</h5>
        {props.children} 
    </div>)
};

export default CardBody;