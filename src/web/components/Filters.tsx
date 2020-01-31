export default function Filters() {
  return (
    <div className="filters">
      <div className="row">
        <div className="col-12">
          <div className="filter-names">
            <h5 className="selected">All</h5>
            <h5>Verified</h5>
            <h5>Liked</h5>
            <h5>My Scripts</h5>
          </div>
        </div>
      </div>
      <div className="search-sort">
        <div className="row">
          <div className="col-xl-9">
            <i className="fas fa-search" />
            <input className="search" placeholder="Placeholder" type="search" />
          </div>
          <div className="col-xl-3">
            <div className="sort">
              <select name="Sort Scripts" id="sort">
                <option value="">Use Count (High to Low)</option>
              </select>
              <i className="fas fa-chevron-down" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
