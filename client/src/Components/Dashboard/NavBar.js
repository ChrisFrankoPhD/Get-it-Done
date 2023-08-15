import {Link} from 'react-router-dom'
import { toast } from 'react-toastify';


const NavBar = ({searchText, setSearchText, setAuth}) => {
  
    // const navigate = useNavigate()
    const updateSearchText = (e) => {
    setSearchText(e.target.value) 
    // console.log(searchText);
    // navigate('/search')
    }
    // console.log(searchText);

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        setAuth(false)
        toast.success("Logged Out")
    }

    return (
        <nav className="navbar navbar-expand-md bg-body-tertiary">
          <div className="w-100 container-md">
            <Link className="navbar-brand ms-2" to="/">ToDo ~ <i>Beta</i></Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={() => {setSearchText("")}}>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse flex-md-grow-0 mt-3 mt-lg-1" id="navbarSupportedContent">
              <form className="d-flex" role="search">
                {/* <Link to=""><button className="btn btn-outline-success" type="submit">Search</button></Link> */}
                <input 
                  className="form-control ms-2 me-5 search-input" 
                  type="search" 
                  placeholder="ToDo Search" 
                  aria-label="Search" 
                  value={searchText}
                  onChange={updateSearchText} 
                />              
              </form>
              <button className="btn btn-primary align-self-end mx-2 mt-2 mt-md-0" onClick={logout}>Logout</button>
            </div>
          </div>
        </nav>
    )
}
export default NavBar