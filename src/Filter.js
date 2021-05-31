import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

const Filter = ({ onFilter }) => {
  const [filterBy, setFilterBy] = useState();
  const [filterList, setFilterList] = useState();
  const [selectedFilterItem, setSelectedFilterItem] = useState();

  const getFilterList = async (value) => {
    try {
      let res;
      switch (value) {
        case 'Alcoholic':
          res = await fetch(
            'https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list'
          );
          break;
        case 'Category':
          res = await fetch(
            'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list'
          );
          break;
        case 'Glass':
          res = await fetch(
            'https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list'
          );
          break;
        default:
          break;
      }

      const result = await res.json();
      setFilterList(result.drinks);
      const defaultFilterItem = result.drinks[0][`str${value}`];
      setSelectedFilterItem(defaultFilterItem);
      onFilter(value, defaultFilterItem);
    } catch (err) {
      console.log(err);
    }
  };

  const onSelectCategory = (item) => {
    setSelectedFilterItem(item[`str${filterBy}`]);
    onFilter(filterBy, item[`str${filterBy}`]);
  };

  const onFilterByChange = (value) => {
    setFilterBy(value);
    setSelectedFilterItem();
    getFilterList(value);
  };

  return (
    <div className='d-flex'>
      <Dropdown className='mr-4'>
        <Dropdown.Toggle variant='primary' id='dropdown-basic'>
          Filter By{filterBy ? `: ${filterBy}` : ''}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => onFilterByChange('Alcoholic')}>
            Alcoholic
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onFilterByChange('Category')}>
            Category
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onFilterByChange('Glass')}>
            Glass
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {selectedFilterItem && (
        <Dropdown>
          <Dropdown.Toggle variant='primary' id='dropdown-basic'>
            {selectedFilterItem}
          </Dropdown.Toggle>

          <Dropdown.Menu className='dropdown__filter__list'>
            {filterList.map((item, i) => (
              <Dropdown.Item key={i} onClick={() => onSelectCategory(item)}>
                {item[`str${filterBy}`]}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

export default Filter;
